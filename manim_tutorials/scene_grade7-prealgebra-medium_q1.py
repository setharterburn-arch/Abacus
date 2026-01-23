from manim import *

class Grade7PrealgebraMedium1(Scene):
    def construct(self):
        expression = MathTex("3(x + 2) - 5").scale(1.2)
        self.play(Write(expression))
        self.wait(1)

        step1 = MathTex("3x + 6 - 5").next_to(expression, DOWN, buff=0.5).scale(1.2)
        arrow1 = Arrow(expression.get_bottom(), step1.get_top(), buff=0.1)
        self.play(TransformFromCopy(expression, step1), Create(arrow1))
        self.wait(1)

        step2 = MathTex("3x + 1").next_to(step1, DOWN, buff=0.5).scale(1.2)
        arrow2 = Arrow(step1.get_bottom(), step2.get_top(), buff=0.1)
        self.play(TransformFromCopy(step1, step2), Create(arrow2))
        self.wait(1)

        self.play(FadeOut(expression, step1, step2, arrow1, arrow2))
        answer = MathTex("\text{Answer: } 3x + 1").scale(1.5)
        self.play(Write(answer))
        self.wait(2)