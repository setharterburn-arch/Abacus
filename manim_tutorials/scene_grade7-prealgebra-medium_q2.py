from manim import *

class Grade7PrealgebraMedium2(Scene):
    def construct(self):
        equation = MathTex(
            "4 \times 2 + 16 \div 4 - 3 &= 8 + 16 \div 4 - 3 \\",
            "&= 8 + 4 - 3 \\",
            "&= 12 - 3 \\",
            "&= 9"
        )

        self.play(Write(equation[0]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[0].copy(), equation[1]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[1].copy(), equation[2]))
        self.wait(1)
        self.play(TransformMatchingTex(equation[2].copy(), equation[3]))
        self.wait(2)
