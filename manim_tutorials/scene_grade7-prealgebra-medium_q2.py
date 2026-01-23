from manim import *

class Grade7PrealgebraMedium2(Scene):
    def construct(self):
        equation = MathTex("2x + 7 = 15").scale(1.2)
        self.play(Write(equation))
        self.wait(1)

        step1 = MathTex("2x = 15 - 7").next_to(equation, DOWN, buff=0.5).scale(1.2)
        arrow1 = Arrow(equation.get_bottom(), step1.get_top(), buff=0.1)
        self.play(TransformFromCopy(equation, step1), Create(arrow1))
        self.wait(1)

        step2 = MathTex("2x = 8").next_to(step1, DOWN, buff=0.5).scale(1.2)
        arrow2 = Arrow(step1.get_bottom(), step2.get_top(), buff=0.1)
        self.play(TransformFromCopy(step1, step2), Create(arrow2))
        self.wait(1)

        step3 = MathTex("x = \frac{8}{2}").next_to(step2, DOWN, buff=0.5).scale(1.2)
        arrow3 = Arrow(step2.get_bottom(), step3.get_top(), buff=0.1)
        self.play(TransformFromCopy(step2, step3), Create(arrow3))
        self.wait(1)

        step4 = MathTex("x = 4").next_to(step3, DOWN, buff=0.5).scale(1.2)
        arrow4 = Arrow(step3.get_bottom(), step4.get_top(), buff=0.1)
        self.play(TransformFromCopy(step3, step4), Create(arrow4))
        self.wait(1)

        self.play(FadeOut(equation, step1, step2, step3, step4, arrow1, arrow2, arrow3, arrow4))
        answer = MathTex("\text{Answer: } x = 4").scale(1.5)
        self.play(Write(answer))
        self.wait(2)